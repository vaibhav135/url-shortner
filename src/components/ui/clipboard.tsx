import { CheckCircle2, Clipboard as ClipboardCopy } from 'lucide-react';
import { isNil, isEmpty } from 'lodash';
import toast from 'react-hot-toast';
import { cva, type VariantProps } from 'class-variance-authority';

type ClipBoardCopyProps = VariantProps<typeof clipboardCopy>;

const clipboardCopy = cva('', {
    variants: {
        intent: {
            primary: [
                'bg-white opacity-70 text-black',
                'border-2 rounded-md ',
                'hover:stroke-gray-100 hover:bg-gray-600',
                'hover:cursor-copy',
            ],
            secondary: [],
        },
        size: {
            small: ['w-6 h-6', 'p-0.5'],
            medium: ['w-7 h-7', 'p-1'],
        },
    },
    defaultVariants: {
        intent: 'primary',
        size: 'medium',
    },
});

const CustomClipboard = ({
    data,
    customStyle,
}: {
    data: string;
    customStyle?: ClipBoardCopyProps;
}) => {
    const handleCopyUrl = async () => {
        if (!isNil(data) && !isEmpty(data)) {
            await navigator.clipboard.writeText(data);

            toast(
                <span className="inline-flex">
                    <CheckCircle2 className="stroke-green-400 mr-2 w-4" />
                    Url Copied Successfully
                </span>
            );
        }
    };

    return (
        <ClipboardCopy
            className={clipboardCopy(customStyle)}
            onClick={handleCopyUrl}
        />
    );
};

export default CustomClipboard;
