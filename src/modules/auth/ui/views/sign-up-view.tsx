"use client"

import z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {toast} from "sonner"
import { Poppins } from "next/font/google"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
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
    FormDescription,
} from "@/components/ui/form"

import { registerSchema } from "../../schema"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"]
})

export const SignUpView = () => {
    const router = useRouter()

    const trpc = useTRPC()
    const register= useMutation(trpc.auth.register.mutationOptions({
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: () => {
            router.push("/")
        },
    }))
    
    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

    const username = form.watch("username");
    const usernamErrors = form.formState.errors.username

    const showPreview = username && !usernamErrors

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
                                <Link prefetch href='/sign-in'>
                                    Sign in
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium">
                            Join over 1,400 creator earning money on sonshop
                        </h1>
                        <FormField
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription
                                        className={cn("hidden", showPreview && "block")}
                                    >
                                        Your store will be availablel at&nbsp
                                        {/* TODO: User proper method to generrate preview url */}
                                        <strong>{username}</strong>.shop.com
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


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
                            disabled={register.isPending}
                            type = "submit"
                            size = "lg"
                            variant= "elevated"
                            className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                        >
                            Create account 
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