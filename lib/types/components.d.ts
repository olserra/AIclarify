import { type VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef } from 'react';

// Button Types
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
    asChild?: boolean;
}

// Input Types
export interface InputProps extends ComponentPropsWithoutRef<'input'> {
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
}

// Textarea Types
export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
    resize?: boolean;
}

// Common Component Types
export type ComponentRef<T extends React.ComponentType<any>> = ElementRef<T>;
export type ComponentProps<T extends React.ComponentType<any>> = ComponentPropsWithoutRef<T>;

// Alert Types
export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
    variant?: VariantProps<typeof alertVariants>['variant'];
}

// Toggle Types
export interface ToggleProps extends ComponentPropsWithoutRef<'button'> {
    variant?: VariantProps<typeof toggleVariants>['variant'];
    size?: VariantProps<typeof toggleVariants>['size'];
    pressed?: boolean;
}

// Dropdown Menu Types
export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<'div'> {
    inset?: boolean;
    disabled?: boolean;
}

export interface DropdownMenuCheckboxItemProps extends ComponentPropsWithoutRef<'div'> {
    checked?: boolean;
    disabled?: boolean;
}

export interface DropdownMenuRadioItemProps extends ComponentPropsWithoutRef<'div'> {
    checked?: boolean;
    disabled?: boolean;
}

// Carousel Types
export interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin[];
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
}

export interface CarouselContextProps {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    opts: ReturnType<typeof useEmblaCarousel>[2];
    orientation: 'horizontal' | 'vertical';
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} 