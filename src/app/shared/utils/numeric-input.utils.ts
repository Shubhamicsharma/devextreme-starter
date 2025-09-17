import { AbstractControl } from '@angular/forms';

export function handleNumericKeyDown(e: any): void {
    const event = e.event as KeyboardEvent;
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const value = input.value;

    // Allow control keys
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key) || 
        (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase()))) {
        return;
    }

    // Allow numbers
    if (key >= '0' && key <= '9') {
        return;
    }

    // Allow one dot
    if (key === '.' && !value.includes('.')) {
        return;
    }

    // Allow k, m, b only at the end and only one of them
    if (['k', 'm', 'b'].includes(key.toLowerCase())) {
        if (!/[kmb]/.test(value.toLowerCase())) {
            return;
        }
    }

    event.preventDefault();
}

export function handleNumericKeyUp(event: any, control: AbstractControl | null): void {
    if (!control) {
        return;
    }
    
    const input = event.event.target as HTMLInputElement;
    const value = input.value.toLowerCase();

    let numericValue: number | null = null;
    if (value.endsWith('k')) {
        numericValue = parseFloat(value.slice(0, -1)) * 1000;
    } else if (value.endsWith('m')) {
        numericValue = parseFloat(value.slice(0, -1)) * 1000000;
    } else if (value.endsWith('b')) {
        numericValue = parseFloat(value.slice(0, -1)) * 1000000000;
    } else {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            numericValue = parsedValue;
        } else if (value === '') {
            control.setValue(null);
            return;
        } else {
            return; // Not a valid number, do nothing.
        }
    }

    if (numericValue !== null && !isNaN(numericValue)) {
        control.setValue(numericValue);
    }
}
