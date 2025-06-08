"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { type FormState } from "@/types/search";
import { SearchInput } from "./SearchInput";

interface SearchFormProps {
  type: string;
  children: React.ReactNode;
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

export function SearchForm({
  type,
  children,
  formState,
  updateFormState,
}: SearchFormProps) {
  const navigate = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form values:", formState);
        // navigate.push("/results/1");
      }}
    >
      <Input
        type="radio"
        value={type}
        name={type}
        className="hidden"
        checked
        readOnly
      />
      <SearchInput
        onSubmit={(e) => e.preventDefault()}
        searchValue={formState.search}
        onSearchChange={(value) => updateFormState({ search: value })}
      />
      {children}
    </form>
  );
}
