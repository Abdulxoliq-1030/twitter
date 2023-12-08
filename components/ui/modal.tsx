import React, { ReactElement } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { X } from 'lucide-react';

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    body?: ReactElement;
    footer?: ReactElement;
    step?: number;
    totalSteps?: number;

}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, body, footer, totalSteps, step }) => {



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-black p-1'>
                <div className='flex items-center gap-4'>
                    <button className='p-1 border-0 text-white hover:opacity-70 transition w-fit'>
                        <X onClick={onClose} size={28} />
                    </button>
                    {step && totalSteps && (
                        <div className="text-xl font-bold">Step {step} of {totalSteps}</div>
                    )}
                </div>
                <div className='mt-4'>
                    {body}
                </div>
                {footer && <div>{footer}</div>}
            </DialogContent>
        </Dialog>
    )
}

export default Modal;