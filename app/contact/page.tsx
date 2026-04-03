"use client";
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from '../../components/ToastProvider';

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const onSubmit = async (values: any) => {
    setBusy(true);
    setStatus(null);
    try {
      await api.post('/contact', values);
      setStatus('Message sent — thank you!');
      success('Message sent — thank you!');
      reset();
    } catch (err: any) {
      setStatus('Error sending message');
      showError('Error sending message');
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} className="max-w-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl">Contact</h2>
      <input {...register('name')} placeholder="Name" className="block w-full my-2 p-2 bg-slate-900 rounded" />
      <input {...register('email', { required: true })} placeholder="Email" className="block w-full my-2 p-2 bg-slate-900 rounded" />
      <textarea {...register('message', { required: true })} placeholder="Message" className="block w-full my-2 p-2 bg-slate-900 h-40 rounded" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="px-4 py-2 bg-indigo-600 rounded mt-2">
          {busy ? 'Sending...' : 'Send'}
        </button>
        {status && <div className="text-sm text-slate-300">{status}</div>}
      </div>
    </motion.form>
  );
}
