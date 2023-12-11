"use client";
import { useRegisterModal } from '@/hooks/use-register-modal'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Modal from '../ui/modal';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { registerStep1Schema, registerStep2Schema } from '@/lib/validation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import Button from '../ui/button';
import axios from "axios"
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ name: "", email: "" })


    const bodyContent = (
        step === 1 ? <RegisterStep1 setData={setData} setStep={setStep} /> : <RegisterStep2 data={data} />
    )

    const footer = (
        <div className='text-neutral-400 text-center mb-4'>
            <p>Already have an account? <span className='text-white cursor-pointer hover:underline'>Sign In</span></p>
        </div>
    )

    return (
        <Modal body={bodyContent} footer={footer} isOpen={registerModal.isOpen} onClose={registerModal.onClose} step={step} totalSteps={2} />
    )
}

export default RegisterModal


function RegisterStep1({ setData, setStep }: { setData: Dispatch<SetStateAction<{ name: string; email: string }>>; setStep: Dispatch<SetStateAction<number>>; }) {

    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof registerStep1Schema>>({
        resolver: zodResolver(registerStep1Schema),
        defaultValues: {
            email: "",
            name: ""
        }
    })

    async function onSubmit(values: z.infer<typeof registerStep1Schema>) {
        try {
            const { data } = await axios.post("/api/auth/register?step=1", values);
            if (data.success) {
                setData(values)
                setStep(2)
            }
        } catch (error: any) {
            if (error.response.data.error) {
                setError(error.response.data.error)
            } else {
                setError("Something went wrong. Please try again later.")
            }
        }


    }

    const { isSubmitting } = form.formState


    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 px-12'>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button label="Next" type='submit' secondary fullWidth large disabled={isSubmitting} />
        </form>
    </Form>
}

function RegisterStep2({ data }: { data: { name: string; email: string } }) {
    const [error, setError] = useState("");
    const registerModal = useRegisterModal();

    const form = useForm<z.infer<typeof registerStep2Schema>>({
        resolver: zodResolver(registerStep2Schema),
        defaultValues: {
            password: "",
            username: "",
        },
    });

    async function onSubmit(values: z.infer<typeof registerStep2Schema>) {
        try {
            const { data: response } = await axios.post("/api/auth/register?step=2", {
                ...data,
                ...values,
            });
            if (response.success) {
                signIn("credentials", {
                    email: data.email,
                    password: values.password
                })
                registerModal.onClose();
            }
        } catch (error: any) {
            if (error.response.data.error) {
                setError(error.response.data.error)
            } else {
                setError("Something went wrong. Please try again later.")
            }
        }
    }

    const { isSubmitting } = form.formState;
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    label={"Register"}
                    type="submit"
                    secondary
                    fullWidth
                    large
                    disabled={isSubmitting}
                />
            </form>
        </Form>
    );
}