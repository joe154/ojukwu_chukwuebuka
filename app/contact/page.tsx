"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../lib/api";
import { useState } from "react";
import { useToast } from "../../components/ToastProvider";
import { motion } from "framer-motion";
import { Input, Textarea, Checkbox } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

// Validation schema
const contactSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters").max(5000, "Message must not exceed 5000 characters"),
  subscribe: yup.boolean(),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@ebuka.dev",
    href: "mailto:hello@ebuka.dev",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "San Francisco, CA",
    href: "#",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { success, error: showError } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormData) => {
    setIsLoading(true);
    try {
      await api.post("/contact", {
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });
      setSubmitSuccess(true);
      success("Message sent successfully! I'll get back to you soon.");
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section className="pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Page Header */}
      <motion.div
        className="space-y-6 mb-16 sm:mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Connect</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Have a project in mind or just want to say hello? I'd love to hear from you. Drop me a message and I'll get back to you as soon as possible.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        {/* Contact Information */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <motion.a
                key={info.title}
                href={info.href}
                variants={itemVariants}
                className="group block no-underline"
              >
                <Card className="group-hover:border-primary-500/50">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors duration-200">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-100 group-hover:text-primary-400 transition-colors duration-200">
                        {info.title}
                      </h3>
                      <p className="text-sm text-slate-400">{info.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.a>
            );
          })}

          {/* Response Time */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border-primary-500/30">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-100">Quick Response Time</p>
                  <p className="text-sm text-slate-400">I typically respond within 24 hours</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitSuccess ? (
            <motion.div
              className="card-lg text-center space-y-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2 }}
                >
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-100">Message Sent!</h3>
                <p className="text-slate-400">
                  Thank you for reaching out. I'll review your message and get back to you shortly.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitSuccess(false);
                  reset();
                }}
              >
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <Card className="card-lg">
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Name Input */}
                <motion.div variants={itemVariants}>
                  <Input
                    {...register("name")}
                    label="Name"
                    placeholder="Your name"
                    error={errors.name?.message}
                    disabled={isLoading}
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants}>
                  <Input
                    {...register("email")}
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    error={errors.email?.message}
                    disabled={isLoading}
                  />
                </motion.div>

                {/* Subject Input */}
                <motion.div variants={itemVariants}>
                  <Input
                    {...register("subject")}
                    label="Subject"
                    placeholder="What is this about?"
                    error={errors.subject?.message}
                    disabled={isLoading}
                  />
                </motion.div>

                {/* Message Textarea */}
                <motion.div variants={itemVariants}>
                  <Textarea
                    {...register("message")}
                    label="Message"
                    placeholder="Tell me about your project, idea, or just say hello..."
                    error={errors.message?.message}
                    disabled={isLoading}
                  />
                </motion.div>

                {/* Subscribe Checkbox */}
                <motion.div variants={itemVariants}>
                  <Checkbox
                    {...register("subscribe")}
                    label="Subscribe to my newsletter for updates and insights"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Send Message
                  </Button>
                </motion.div>

                {/* Info Text */}
                <p className="text-xs text-slate-500 text-center">
                  I'll get back to you within 24 hours. Your information is safe with me.
                </p>
              </motion.form>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
