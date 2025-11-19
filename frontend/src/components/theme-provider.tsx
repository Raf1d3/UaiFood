"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Se der erro de tipo no import abaixo, instale: npm i --save-dev @types/node
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}