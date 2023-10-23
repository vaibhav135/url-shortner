import {
    AlertDialog as AlertDialogRoot,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type AlertDialogProps = {
    title: string;
    description: string;
    onCancel: () => void;
    onSubmit: () => void;
    show: boolean;
    cancelText?: string;
    submitText?: string;
};

export const AlertDialog = ({
    title,
    description,
    cancelText = 'Cancel',
    submitText = 'Submit',
    show = false,
    onCancel,
    onSubmit,
}: AlertDialogProps) => {
    return (
        <AlertDialogRoot open={show}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>
                        {submitText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogRoot>
    );
};
