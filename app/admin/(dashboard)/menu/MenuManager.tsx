"use client";

import { useOptimistic, useState, useTransition } from "react";
import Image from "next/image";
import type { Category, MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import {
  deleteMenuItem,
  moveRow,
  saveMenuItem,
  setItemAvailability,
  setItemVisibility,
  updateItemPrice,
} from "@/app/admin/actions/mutations";
import { toast, SAVED } from "@/components/admin/Toaster";
import { Switch } from "@/components/ui/switch";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import ImageInput from "@/components/admin/ImageInput";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function MenuManager({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [editing, setEditing] = useState<MenuItem | "new" | null>(null);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="btn-ember w-full px-6 py-4 text-base"
      >
        + Add a menu item
      </button>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        if (!catItems.length) return null;
        return (
          <section key={cat.id} className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ash">
              {cat.name}
            </h2>
            <ul className="space-y-2">
              {catItems.map((item, idx) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isFirst={idx === 0}
                  isLast={idx === catItems.length - 1}
                  onEdit={() => setEditing(item)}
                />
              ))}
            </ul>
          </section>
        );
      })}

      {!items.length && (
        <p className="mt-8 text-sm text-ash">
          No menu items yet — add the first one above.
        </p>
      )}

      {editing && (
        <ItemDialog
          categories={categories}
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ItemRow({
  item,
  isFirst,
  isLast,
  onEdit,
}: {
  item: MenuItem;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
}) {
  const [, startTransition] = useTransition();
  const [optimisticAvailable, setOptimisticAvailable] = useOptimistic(
    item.available
  );
  const [priceDraft, setPriceDraft] = useState<string | null>(null);

  function toggleAvailability(next: boolean) {
    startTransition(async () => {
      setOptimisticAvailable(next);
      const res = await setItemAvailability(item.id, next);
      if (res.ok) toast(next ? SAVED : "Marked sold out — live on the site now.");
      else toast(res.error, true);
    });
  }

  function commitPrice() {
    if (priceDraft === null) return;
    const draft = priceDraft;
    setPriceDraft(null);
    startTransition(async () => {
      const res = await updateItemPrice(item.id, draft);
      if (res.ok) toast(SAVED);
      else toast(res.error, true);
    });
  }

  return (
    <li
      className={cn(
        "admin-card p-4",
        !item.visible && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3">
        {item.image && (
          <Image
            src={item.image}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded object-cover"
            unoptimized
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-bone">
            {item.name}
            {!item.visible && (
              <span className="ml-2 text-xs text-ash">(hidden)</span>
            )}
            {item.featured && (
              <span className="ml-2 text-xs text-gold">★ featured</span>
            )}
          </p>
          <input
            aria-label={`Price for ${item.name} in rands`}
            inputMode="decimal"
            className="mt-1 w-28 rounded border border-transparent bg-transparent px-1 py-0.5 text-sm text-ash focus:border-hair focus:bg-char focus:text-bone focus:outline-none"
            value={
              priceDraft ??
              (item.price === null ? "" : String(item.price / 100))
            }
            placeholder={formatPrice(item.price)}
            onChange={(e) => setPriceDraft(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[0.625rem] uppercase tracking-wider text-ash">
            {optimisticAvailable ? "Available" : "Sold out"}
          </span>
          <Switch
            checked={optimisticAvailable}
            onCheckedChange={toggleAvailability}
            aria-label={`${item.name} availability`}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-hair pt-2">
        <RowButton
          disabled={isFirst}
          label={`Move ${item.name} up`}
          onClick={() =>
            startTransition(async () => {
              const res = await moveRow("menu_items", item.id, "up", {
                column: "category_id",
                value: item.categoryId,
              });
              if (!res.ok) toast(res.error, true);
            })
          }
        >
          ↑
        </RowButton>
        <RowButton
          disabled={isLast}
          label={`Move ${item.name} down`}
          onClick={() =>
            startTransition(async () => {
              const res = await moveRow("menu_items", item.id, "down", {
                column: "category_id",
                value: item.categoryId,
              });
              if (!res.ok) toast(res.error, true);
            })
          }
        >
          ↓
        </RowButton>
        <button
          type="button"
          onClick={onEdit}
          className="rounded px-3 py-2.5 text-xs uppercase tracking-wider text-ash hover:text-bone"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              const res = await setItemVisibility(item.id, !item.visible);
              if (res.ok) toast(SAVED);
              else toast(res.error, true);
            })
          }
          className="rounded px-3 py-2.5 text-xs uppercase tracking-wider text-ash hover:text-bone"
        >
          {item.visible ? "Hide" : "Show"}
        </button>
        <ConfirmDelete
          what={item.name}
          onConfirm={() => deleteMenuItem(item.id)}
        />
      </div>
    </li>
  );
}

function RowButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded px-3.5 py-2.5 text-sm text-ash hover:text-bone disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ItemDialog({
  categories,
  item,
  onClose,
}: {
  categories: Category[];
  item: MenuItem | null;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [photo, setPhoto] = useState<File | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photo");
    if (photo) fd.set("photo", photo);
    if (item) fd.set("id", item.id);
    startTransition(async () => {
      const res = await saveMenuItem(fd);
      if (res.ok) {
        toast(SAVED);
        onClose();
      } else {
        toast(res.error, true);
      }
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogTitle>{item ? `Edit ${item.name}` : "Add a menu item"}</DialogTitle>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Name">
            <input
              name="name"
              required
              defaultValue={item?.name}
              className="admin-input"
            />
          </Field>
          <Field label="Category">
            <Select
              name="categoryId"
              defaultValue={item?.categoryId ?? categories[0]?.id}
              className="rounded"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price in rands (leave empty for 'Ask at the counter')">
            <input
              name="price"
              inputMode="decimal"
              defaultValue={item?.price != null ? String(item.price / 100) : ""}
              placeholder="e.g. 120"
              className="admin-input"
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              name="description"
              defaultValue={item?.description ?? ""}
              className="min-h-20 admin-input"
            />
          </Field>
          <Field label="Tags — comma separated (optional)">
            <input
              name="tags"
              defaultValue={item?.tags.join(", ")}
              placeholder="spicy, sharing"
              className="admin-input"
            />
          </Field>
          <ImageInput existingUrl={item?.image} onFile={setPhoto} />
          <label className="flex items-center gap-3 py-1 text-sm text-bone">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={item?.featured}
              className="h-5 w-5 accent-[#c8102e]"
            />
            Show in the &ldquo;From the Fire&rdquo; strip on the homepage
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="btn-ember flex-1 px-4 py-3.5 text-sm"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <DialogClose className="btn-quiet flex-1 px-4 py-3.5 text-sm">
              Cancel
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.6875rem] uppercase tracking-[0.18em] text-ash">
        {label}
      </span>
      {children}
    </label>
  );
}
