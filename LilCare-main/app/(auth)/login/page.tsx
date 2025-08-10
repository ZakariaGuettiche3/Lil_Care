import LoginForm from '@/components/LoginForm'
import { supabaseServer } from '@/lib/supabase/server'
import { redirect } from "next/navigation";
import { headers } from 'next/headers'

type Props = {}

const Page = async (props: Props) => {


  const supabase = await supabaseServer();
  const currentUser = (await supabase.auth.getUser()).data?.user;

  const headersList = headers();
  const fullUrl = headersList.get("path");

  if (currentUser) {
    if (fullUrl) {
       redirect(`/${currentUser.user_metadata?.role?.toLowerCase()}/` + fullUrl);
    }
     redirect(`/${currentUser.user_metadata?.role?.toLowerCase()}/`);
  }

  
  return (
    <LoginForm />
  )
}

export default Page