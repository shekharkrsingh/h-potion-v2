import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomDialog, CustomDialogProps } from '@/components/ui/CustomDialog';

export type DialogOptions = Omit<CustomDialogProps, 'visible' | 'onClose'>;

interface DialogContextType {
    showDialog: (options: DialogOptions) => void;
    hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogState, setDialogState] = useState<{ visible: boolean; options: DialogOptions | null }>({
        visible: false,
        options: null,
    });

    const showDialog = (options: DialogOptions) => {
        setDialogState({ visible: true, options });
    };

    const hideDialog = () => {
        setDialogState((prev) => ({ ...prev, visible: false }));
    };

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            {children}
            {dialogState.options && (
                <CustomDialog
                    visible={dialogState.visible}
                    onClose={hideDialog}
                    {...dialogState.options}
                />
            )}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};
