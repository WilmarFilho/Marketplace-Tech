'use client';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';
import type { Tables } from '@/src/types/supabase';
import { sendMessage } from '@/app/(main)/anuncio/[id]/actions';
import { useState, useTransition } from 'react';

interface ProductContactProps {
  product: Tables<'products'> & {
    seller?: {
      phone?: string;
    };
  };
}

export default function ProductContact({ product }: ProductContactProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Função para validar Telefone Brasileiro (DDD + 8 ou 9 dígitos)
  const isValidPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove tudo que não é número
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação antes de iniciar a Transition
    if (!isValidPhone(formData.phone)) {
      setError('Por favor, insira um telefone válido com DDD (ex: 11999999999)');
      return;
    }
    
    startTransition(async () => {
      try {
        setError(null);
        const data = new FormData();
        data.append('productId', product.id);
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('message', formData.message);
        
        await sendMessage(data);
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          message: ''
        });
      } catch {
        setError('Erro ao enviar mensagem. Tente novamente.');
      }
    });
  };

  const handleWhatsAppClick = () => {
    const phone = product.contact_phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const message = `Olá! Vi seu anúncio "${product.title}" na DropTech e gostaria de mais informações.`;
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <aside className={styles.contactCard}>
      <div className={styles.contactCardHeader}>
        <div className={styles.productTitlePrice}>
          <div className={styles.price}>
            <strong>{formatPrice(product.price)}</strong>
          </div>

          {product.contact_phone && (
            <button onClick={handleWhatsAppClick} className={styles.whatsappButton}>
              <Image src="/figma/wpp.png" alt="WhatsApp" width={48} height={48} />
            </button>
          )}
        </div>

        {isSubmitted ? (
          <div className={styles.successMessage}>
            <h3>Mensagem enviada com sucesso!</h3>
            <p>O vendedor receberá sua mensagem e entrará em contato em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.contactForm}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="contact-name" className={styles.formLabel}>Nome completo</label>
              <input 
                id="contact-name"
                name="fullName"
                className={styles.formInput}
                placeholder="Digite seu nome completo"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contact-email" className={styles.formLabel}>E-mail</label>
              <input 
                id="contact-email"
                name="email"
                className={styles.formInput}
                placeholder="Digite seu melhor e-mail"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contact-phone" className={styles.formLabel}>Telefone</label>
              <input 
                id="contact-phone"
                name="phone"
                className={styles.formInput}
                placeholder="(00) 00000-0000"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="contact-message" className={styles.formLabel}>Mensagem</label>
              <textarea 
                id="contact-message"
                name="message"
                className={styles.formTextarea}
                placeholder={`Tenho interesse no produto "${product.title}". Poderia me enviar mais detalhes?`}
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isPending}
            >
              <MessageCircle size={20} />
              {isPending ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}