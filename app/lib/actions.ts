'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
/*export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  redirect('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  redirect('/dashboard/invoices');
    // Test it out: fiye chufjaweb user bel form 3al terminal
    //console.log(rawFormData);
  }
  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }*/
    const CreateInvoice = FormSchema.omit({ id: true, date: true });
    export async function createInvoice(formData: FormData) {
        const { customerId, amount, status } = CreateInvoice.parse({
          customerId: formData.get('customerId'),
          amount: formData.get('amount'),
          status: formData.get('status'),
        });
       
        const amountInCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];
       
        try {
          await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
          `;
        } catch (error) {
          return {
            message: 'Database Error: Failed to Create Invoice.',
          };
        }
       
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
      }
      export async function updateInvoice(id: string, formData: FormData) {
        const { customerId, amount, status } = UpdateInvoice.parse({
          customerId: formData.get('customerId'),
          amount: formData.get('amount'),
          status: formData.get('status'),
        });
       
        const amountInCents = amount * 100;
       
        try {
          await sql`
              UPDATE invoices
              SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
              WHERE id = ${id}
            `;
        } catch (error) {
          return { message: 'Database Error: Failed to Update Invoice.' };
        }
       
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
      }
      export async function deleteInvoice(id: string) {
        try {
          await sql`DELETE FROM invoices WHERE id = ${id}`;
          revalidatePath('/dashboard/invoices');
          return { message: 'Deleted Invoice.' };
        } catch (error) {
          return { message: 'Database Error: Failed to Delete Invoice.' };
        }
      }