import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import styles from './product.module.css';

export default function ProductContact() {
  return (
    <aside className={styles.contactCard}>

      <div className={styles.contactCardHeader}>
        <div className={styles.productTitlePrice}>
          <div className={styles.price}>
            <strong>R$ 1200</strong>
            <span>R$ 1400</span>
          </div>

          <Image src="/figma/wpp.png" alt="Avatar do vendedor" width={48} height={48} />
        </div>

        <div className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="contact-name" className={styles.formLabel}>Nome completo</label>
            <input 
              id="contact-name"
              className={styles.formInput}
              placeholder="Digite seu nome completo"
              type="text"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="contact-email" className={styles.formLabel}>E-mail</label>
            <input 
              id="contact-email"
              className={styles.formInput}
              placeholder="Digite seu melhor e-mail"
              type="email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="contact-message" className={styles.formLabel}>Mensagem</label>
            <textarea 
              id="contact-message"
              className={styles.formTextarea}
              placeholder="Digite sua mensagem ou dúvida sobre o produto"
              rows={4}
            />
          </div>
        </div>

        <button className={styles.send}>
          ENVIAR MENSAGEM <MessageCircle size={18} />
        </button>
      </div>

      <button className={styles.report}>
        Denunciar este anúncio
      </button>
    </aside>
  );
}
