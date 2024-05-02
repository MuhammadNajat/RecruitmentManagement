'use serevr';

import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';
import * as bcrypt from "bcrypt";
import { updateUserData } from '@/app/lib/data/users/mutations/updateUserPassword';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  updateUserData(params.id, password, hashedPassword);

  revalidatePath('/admin/users');

  redirect('/admin/users');
}