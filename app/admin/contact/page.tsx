"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import MediaPickerModal from "@/app/components/admin/MediaPickerModal";
import toast from "react-hot-toast";
import {
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineMail,
} from "react-icons/hi";

interface ContactInfoItem {
  label: string;
  value: string;
  href: string | null;
  icon: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface ContactConfig {
  badgeText: string;
  heading: string;
  subtitle: string;
  contactInfo: ContactInfoItem[];
  web3FormsAccessKey: string;
  socials: SocialLink[];
}

interface FooterConfig {
  logoImage: string;
  copyrightText: string;
}

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactConfig | null>(null);
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    async function loadConfigs() {
      try {
        const [contactRes, footerRes] = await Promise.all([
          fetch("/api/admin/config?key=contact&state=draft"),
          fetch("/api/admin/config?key=footer&state=draft"),
        ]);
        const contactJson = await contactRes.json();
        const footerJson = await footerRes.json();

        if (contactJson.data) setContact(contactJson.data);
        if (footerJson.data) setFooter(footerJson.data);
      } catch {
        toast.error("Failed to load contact & footer settings");
      } finally {
        setLoading(false);
      }
    }
    loadConfigs();
  }, []);

  const handleSave = async () => {
    if (!contact || !footer) return false;
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "contact", data: contact }),
        }),
        fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "footer", data: footer }),
        }),
      ]);
      toast.success("Contact & Footer draft saved!");
      setIsDirty(false);
      return true;
    } catch {
      toast.error("Error saving contact draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddInfo = () => {
    if (!contact) return;
    setContact({
      ...contact,
      contactInfo: [
        ...contact.contactInfo,
        { label: "Channel", value: "info@example.com", href: "mailto:info@example.com", icon: "HiOutlineMail" },
      ],
    });
    setIsDirty(true);
  };

  const handleUpdateInfo = (index: number, field: keyof ContactInfoItem, val: any) => {
    if (!contact) return;
    const items = [...contact.contactInfo];
    items[index] = { ...items[index], [field]: val };
    setContact({ ...contact, contactInfo: items });
    setIsDirty(true);
  };

  const handleDeleteInfo = (index: number) => {
    if (!contact) return;
    setContact({
      ...contact,
      contactInfo: contact.contactInfo.filter((_, i) => i !== index),
    });
    setIsDirty(true);
  };

  if (loading || !contact || !footer) {
    return (
      <AdminShell title="Contact & Footer">
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading Contact Settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Contact & Footer"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="Contact &amp; Footer"
        description="Configure direct communication channels, Web3Forms email gateway key, and footer copyright."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Contact Headlines */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            1. Section Headlines &amp; API Key
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={contact.badgeText}
                onChange={(e) => {
                  setContact({ ...contact, badgeText: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={contact.heading}
                onChange={(e) => {
                  setContact({ ...contact, heading: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={contact.subtitle}
              onChange={(e) => {
                setContact({ ...contact, subtitle: e.target.value });
                setIsDirty(true);
              }}
              className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Web3Forms Access Key (Contact Form Gateway)
            </label>
            <input
              type="password"
              value={contact.web3FormsAccessKey || ""}
              onChange={(e) => {
                setContact({ ...contact, web3FormsAccessKey: e.target.value });
                setIsDirty(true);
              }}
              placeholder="e.g. 1a2b3c4d-..."
              className="w-full text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Leave blank to use default fallback. Obtain a free key at web3forms.com.
            </p>
          </div>
        </section>

        {/* Direct Communication Channels */}
        <section className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              2. Direct Contact Channels
            </h3>
            <button
              type="button"
              onClick={handleAddInfo}
              className="btn btn-outline text-xs h-8 px-3 gap-1"
            >
              <HiOutlinePlus /> Add Channel
            </button>
          </div>

          <div className="space-y-2">
            {contact.contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="p-3 border border-border rounded-lg bg-card flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={info.label}
                      onChange={(e) => handleUpdateInfo(idx, "label", e.target.value)}
                      className="w-full text-xs font-medium px-2.5 py-1.5 border border-input rounded bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                      Display Text
                    </label>
                    <input
                      type="text"
                      value={info.value}
                      onChange={(e) => handleUpdateInfo(idx, "value", e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border border-input rounded bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                      Link (mailto: or tel:)
                    </label>
                    <input
                      type="text"
                      value={info.href || ""}
                      onChange={(e) => handleUpdateInfo(idx, "href", e.target.value || null)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 border border-input rounded bg-background"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteInfo(idx)}
                  className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors"
                  title="Delete channel"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Settings */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            3. Footer Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Footer Logo Image Asset
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={footer.logoImage}
                  onChange={(e) => {
                    setFooter({ ...footer, logoImage: e.target.value });
                    setIsDirty(true);
                  }}
                  className="flex-1 text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="btn btn-outline text-xs h-9 px-3 gap-1 shrink-0"
                >
                  <HiOutlinePhotograph /> Pick
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={footer.copyrightText}
                onChange={(e) => {
                  setFooter({ ...footer, copyrightText: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
        </section>
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        filterType="images"
        title="Select Footer Logo"
        onSelect={(url) => {
          setFooter({ ...footer, logoImage: url });
          setIsDirty(true);
        }}
      />
    </AdminShell>
  );
}
