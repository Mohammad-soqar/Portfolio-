import React from 'react';
import { useForm } from 'react-hook-form';

export function MyForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch('../../.netlify/functions/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Form submitted successfully');
            } else {
                console.error('Form submission error');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('name')} placeholder="Name" required />
            <input type="email" {...register('email')} placeholder="Email" required />
            <textarea {...register('message')} placeholder="Message" required />
            <button type="submit">Submit</button>
        </form>
    );
}
