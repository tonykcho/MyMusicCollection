'use client'

import AuthService from "@/services/auth-service";
import { Drawer, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle } from "react";

export interface CredentialDrawerRef
{
    openDrawer: () => void;
}

export interface CredentialDrawerProps
{
    onCredentialsUpdated: () => void;
}

const CredentialDrawer = forwardRef<CredentialDrawerRef, CredentialDrawerProps>((props, ref) =>
{
    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
    });

    const { mutate: updateCredentials } = useMutation({
        mutationFn: ({ username, password }: typeof form.values) => AuthService.setCredentials(username, password),
        onSuccess: () =>
        {
            props.onCredentialsUpdated();
            close();
        }
    });

    useImperativeHandle(ref, () => ({
        openDrawer: openDrawer,
    }));

    function openDrawer()
    {
        form.reset();
        form.setFieldValue('username', AuthService.username ?? '');
        open();
    }

    return (
        <Drawer opened={opened} onClose={close} withCloseButton={false} padding="xl" size="md">
            <div className="flex flex-row items-center px-4 h-15 bg-amber-500 fixed top-0 right-0 left-0">
                <p className="text-white text-lg font-bold">Set Credentials</p>
            </div>
            <form onSubmit={form.onSubmit((values) => updateCredentials(values))} className="flex flex-col h-full pt-10">
                <TextInput
                    className="mb-3"
                    label="Username"
                    placeholder="Enter your username"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />
                <PasswordInput
                    className="mb-3"
                    label="Password"
                    placeholder="Enter your password"
                    {...form.getInputProps('password')}
                />
                <button type="submit" className="mt-3 bg-purple-400 text-white p-2 rounded hover:bg-purple-500 transition-colors active:scale-95 transition-transform">Save Credentials</button>
            </form>
        </Drawer>
    );
});

CredentialDrawer.displayName = "CredentialDrawer";

export default CredentialDrawer;