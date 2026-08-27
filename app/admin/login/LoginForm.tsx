"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions/auth";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 w-full max-w-xs space-y-4">
      <label htmlFor="password" className="sr-only">
        Staff password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="w-full rounded border border-hair bg-smoke px-4 py-4 text-base text-bone placeholder:text-ash/60 focus:border-ember focus:outline-none"
      />
      {state.error && (
        <p className="text-sm text-flame" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-ember px-4 py-4 text-sm font-semibold uppercase tracking-wider text-bone disabled:opacity-50"
      >
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
