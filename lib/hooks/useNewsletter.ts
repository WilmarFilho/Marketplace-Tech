'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useNewsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Por favor, digite um email válido');
      setIsSuccess(false);
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor, digite um email válido');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      
      // Verificar se o email já está cadastrado
      const { data: existingEmail } = await supabase
        .from('newsletter')
        .select('email')
        .eq('email', email)
        .single();

      if (existingEmail) {
        setMessage('Este email já está cadastrado na nossa newsletter!');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      // Cadastrar o email
      const { error } = await supabase
        .from('newsletter')
        .insert({ email });

      if (error) {
        throw error;
      }

      setMessage('Obrigado! Email cadastrado com sucesso na nossa newsletter!');
      setIsSuccess(true);
      setEmail('');
      
      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Erro ao cadastrar email:', error);
      setMessage('Erro ao cadastrar email. Tente novamente.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    message,
    isSuccess,
    subscribe
  };
}