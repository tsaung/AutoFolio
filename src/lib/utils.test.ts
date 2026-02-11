import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('c-1', 'c-2')).toBe('c-1 c-2')
        })

        it('should handle conditional classes', () => {
            expect(cn('c-1', true && 'c-2', false && 'c-3')).toBe('c-1 c-2')
        })

        it('should handle tailwind conflicts', () => {
            // tailwind-merge should resolve this to p-4 (last wins)
            expect(cn('p-2', 'p-4')).toBe('p-4')
        })

        it('should handle undefined/null inputs', () => {
            expect(cn('c-1', undefined, null)).toBe('c-1')
        })

        it('should handle array inputs', () => {
            expect(cn(['c-1', 'c-2'])).toBe('c-1 c-2')
        })
    })
})
