import PreRegistration from '@/components/PreRegistration'
import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const Page = async (props: Props) => {

  const supabase = await supabaseServer();

  
  const currentUser =  (await supabase.auth.getSession()).data.session?.user

  console.log(currentUser);
  
  if (currentUser) {

    return redirect(`${currentUser?.user_metadata?.role?.toLowerCase()}`)
  }


  return (
    <div className='h-screen flex justify-center items-center'>
      <PreRegistration />
    </div>
  )
}

export default Page