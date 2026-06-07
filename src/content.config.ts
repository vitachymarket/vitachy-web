import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const productSchema = z.object({
  asin: z.string(),
  codigo: z.string(),
  familia: z.string(),
  orden: z.number(),
  titulo: z.string(),
  nombre_corto: z.string().optional(),
  bullets: z.array(z.string()),
  descripcion_html: z.string(),
  imagenes: z
    .array(
      z.object({
        url: z.string().url(),
        posicion: z.number(),
        alt: z.string(),
      }),
    )
    .default([]),
  precio: z.number().nullable(),
  currency: z.string(),
  amazon_url: z.string().url(),
  rating: z.number().nullable(),
  total_resenas: z.number().nullable(),
  actualizado: z.string(),
  _placeholder: z.boolean().optional(),
  _revision_tono: z.boolean().optional(),
});

const familySchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  orden: z.number(),
  descripcion_corta: z.string(),
});

const products = defineCollection({
  loader: glob({
    pattern: '*/products/*.json',
    base: './src/content',
  }),
  schema: productSchema,
});

const families = defineCollection({
  loader: file('src/content/es/families.json'),
  schema: familySchema,
});

export const collections = { products, families };
