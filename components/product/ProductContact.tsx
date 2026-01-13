import { MessageCircle } from 'lucide-react';
import styles from './product.module.css';

export default function ProductContact() {
  return (
    <aside className={styles.contactCard}>
      <div className={styles.price}>
        <strong>R$ 1200</strong>
        <span>R$ 1400</span>
      </div>

      <input placeholder="Digite seu nome" />
      <input placeholder="Digite seu melhor email" />
      <textarea placeholder="Digite sua mensagem" />

      <button className={styles.send}>
        ENVIAR MENSAGEM <MessageCircle size={18} />
      </button>

      <button className={styles.report}>
        Denunciar este anúncio
      </button>
    </aside>
  );
}
