import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./secao-missao.module.css";

type Testimonial = {
  name: string;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Carlos G.",
    text: "\"Em poucos dias comecei a receber mensagens de pessoas que realmente entendem de tecnologia.\"",
  },
  {
    name: "Michelle C.",
    text: "\"Gostei muito da DropTech. Dá pra encontrar produtos tech de forma rápida, organizada e sem propaganda de marketplaces.\"",
  },
  {
    name: "Yasmin R.",
    text: "\"Estou há semanas tentando vender meu iPhone; anunciei aqui sem expectativa e, pra minha surpresa, apareceu alguém e vendi sem dor de cabeça!\"",
  },
];

function Stars() {
  return (
    <div className={styles.stars} aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg
          key={idx}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ name, text, className }: { name: string; text: string; className?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.cardTop}>
        <div className={styles.avatar} aria-hidden>
          {initials}
        </div>
        <div className={styles.cardMeta}>
          <div className={styles.cardName}>{name}</div>
          <Stars />
        </div>
      </div>
      <p className={styles.cardText}>{text}</p>
    </div>
  );
}

export function SecaoMissao() {
  return (
    <section id="sobre" className={cn("w-full scroll-mt-[262px]", styles.section)}>
      <div className={cn("mx-auto w-full max-w-[1800px]", styles.inner)}>
        <div className={styles.grid}>
          <div className={styles.left} aria-hidden>
            <div className={styles.productMock} />
          </div>

          <div id="missao"  className={styles.right}>
            <div className={styles.kicker}>Nossa missão</div>

            <h2 className={styles.title}>
              Conectar tecnologia a oportunidades reais
            </h2>

            <p className={styles.subtitle}>
              Queremos facilitar a compra e venda de tecnologia, aproximando quem vende e procura produtos tech.
            </p>

            <Link href="/explorar" className={styles.cta}>
              Explorar Ofertas
            </Link>

            <div className={styles.floatingCards}>
              <TestimonialCard
                name={testimonials[0].name}
                text={testimonials[0].text}
                className={styles.cardA}
              />
              <TestimonialCard
                name={testimonials[1].name}
                text={testimonials[1].text}
                className={styles.cardB}
              />
              <TestimonialCard
                name={testimonials[2].name}
                text={testimonials[2].text}
                className={styles.cardC}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
