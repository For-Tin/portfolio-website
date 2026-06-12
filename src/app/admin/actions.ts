"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    return { error: "Введіть email та пароль" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Неправильний email або пароль" };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function toggleMessageSaw(id: string | number, currentStatus: boolean) {
  const supabase = await createClient();
  
  // Explicitly check for authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Ви повинні увійти в систему." };
  }
  
  const { error } = await supabase
    .from("contact_messages")
    .update({ saw: !currentStatus })
    .eq("id", id);
    
  if (error) {
    console.error("Error toggling message status:", error);
    return { error: error.message };
  }
  
  revalidatePath('/admin');
}

export async function deleteMessage(id: string | number) {
  const supabase = await createClient();
  
  // Explicitly check for authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Ви повинні увійти в систему." };
  }
  
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting message:", error);
    return { error: error.message };
  }
  
  revalidatePath('/admin');
}
export async function toggleFormsEnabled(currentStatus: boolean) {
  const supabase = await createClient();
  
  // Explicitly check for authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized. Ви повинні увійти в систему." };
  }
  
  const newValue = (!currentStatus).toString(); // true -> "false", false -> "true"
  
  const { error } = await supabase
    .from("site_settings")
    .update({ value: newValue })
    .eq("key", "forms_enabled");
    
  if (error) {
    console.error("Error toggling forms status:", error);
    return { error: error.message };
  }
  
  revalidatePath('/admin');
  revalidatePath('/');
}
