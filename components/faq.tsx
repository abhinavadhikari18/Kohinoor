"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "What is the price of a room at Kohinoor Restaurant?",
    answer: "Our cheapest cozy rooms start at just Rs 500 per night, providing an affordable and comfortable stay in the Bhairahawa and Butwal area.",
  },
  {
    question: "Are the private cabins free to use?",
    answer: "Yes! We offer complimentary private cabins for our dining guests. They are perfect for couples seeking a romantic atmosphere or for private birthday celebrations.",
  },
  {
    question: "What kind of food do you specialize in?",
    answer: "We are famous for our Sekuwa Corner, featuring authentic Chicken, Buff, and Pork Sekuwa grilled with local spices. We also offer a wide range of Nepali and international dishes.",
  },
  {
    question: "Do you have boating facilities?",
    answer: "Yes, we have a serene lake on-site where guests can enjoy peaceful boating, making us a unique destination in Kotihawa.",
  },
  {
    question: "Is Kohinoor Restaurant near Lumbini?",
    answer: "Yes, we are located in Tilottama-13, Kotihawa, which is a convenient nature-friendly stop for travelers visiting the sacred site of Lumbini.",
  },
]

export default function FAQ() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <HelpCircle className="w-6 h-6 text-amber-500" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Kohinoor Restaurant & Cozy Rooms
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-serif text-lg hover:text-amber-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
