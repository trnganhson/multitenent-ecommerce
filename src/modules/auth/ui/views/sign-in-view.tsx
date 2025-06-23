"use client"

import z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {toast} from "sonner"
import { Poppins } from "next/font/google"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { useTRPC } from "@/trpc/client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { loginSchema } from "../../schema"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const SignInView = () => {
    const router = useRouter()

    //Example use REST API
    // const login = useMutation({
    //     mutationFn: async(values: z.infer<typeof loginSchema>)=>{
    //         const response = await fetch("/api/users/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-type": "application/json"
    //             },
    //             body: JSON.stringify(values),

    //         })

    //         if(!response.ok){
    //             const error = await response.json();
    //             throw new Error(error.message || "Login failer");
    //         }

    //         return response.json()
    //     },
        
    //     onError: (error) =>{
    //         toast.error(error.message)
    //     },
    //     onSuccess: () => {
    //         router.push("/")
    //     },
    // })

    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const login = useMutation(trpc.auth.login.mutationOptions({        
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push("/")
        },
    }))
    
    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-8 p-4 lg:p-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/">
                                <span className={cn("text-2xl font-semibold", poppins.className)}>
                                    sonshop
                                </span>
                            </Link>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-base border-none underline"
                            >
                                <Link prefetch href='/sign-up'>
                                    Sign up
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            Welcome back to Sonshop.
                        </h1>

                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button 
                            disabled={login.isPending}
                            type = "submit"
                            size = "lg"
                            variant= "elevated"
                            className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                        >
                            Log in
                        </Button>
                    </form>
                </Form>
            </div>
            <div
                className="h-screen w-full hidden lg:block lg:col-span-2"
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        </div>
    )
}