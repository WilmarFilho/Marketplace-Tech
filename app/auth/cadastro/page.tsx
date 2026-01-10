import { FormCadastro } from "@/components/forms/form-cadastro";

export default function CadastroPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <FormCadastro />
      </div>
    </div>
  );
}
