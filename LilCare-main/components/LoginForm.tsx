"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({ email: z.string(), password: z.string() });

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const supabase = supabaseBrowser();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const callbackUrl = useSearchParams().get('callbackUrl')!;
  const error = useSearchParams().get('error') == "access_denied"

  

  

  const handleLoginWithEmail = (data: { email: string; password: string }) => {
    console.log(data);

    setIsSubmitting(true)
    supabase.auth
      .signInWithPassword(data)
      .then((response) => {
        const user = response.data.user
        if (!user) {
          form.setError("email", { message: response.error?.message });
          setIsSubmitting(false)
          
          return;
        }

        router.replace(`/${user?.user_metadata?.role?.toLowerCase() || "/"}`);
        setIsSubmitting(false)
      })
      .catch((response) => {
        setIsSubmitting(false)
        form.setError("email", { message: response.error?.message });
       
      });
    

  };

  // const handleResend = async (e) => {
  //   supabase.auth.resend({"email" : form.getValues("email")})

  // }
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/">
            <h1 className="text-3xl font-bold">
              <img
                className="h-8 w-auto mx-auto"
                loading="lazy"
                src="https://saasproject.blob.core.windows.net/nursery/logo-light_bleu__Recovered_-removebg-preview.png?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D"
                alt="Your Company"
              />
            </h1>
            </Link>
            <p className="text-balance text-muted-foreground">
              Welcome back
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginWithEmail)}>
            {!error ?  <>
             <div className="grid gap-4">
              
                <div className="grid gap-2">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input
                            onChange={field.onChange}
                            type="email"
                            placeholder="m@example.com"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            name="email"
                            onChange={field.onChange}
                            type="password"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> 
                  
                  
                </div>
                
                <Button type="submit" className="w-full">
                  {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                  Login
                </Button>
                
              </div>
              </> : <Button onClick={() =>{}} > Resend Code </Button>}
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://saasproject.blob.core.windows.net/nursery/_6eafcf6c-902d-4b78-96b4-b3aaf0c8e9f8.jpg?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
