import Image from 'next/image';
import Dawn from 'public/images/dawn.svg';

const BackgroundSceneryForRocketLaunch = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <Image
            alt="someImage"
            src={Dawn}
            objectFit="cover"
            layout="fill"
            className={className}
        />
    );
};

const RocketLaunch = () => {
    return (
        <div>
            <div className="relative z-10 text-2xl text-[#6767a1] row-center mt-4 w-[43rem] typewriter">
                {' '}
                Please wait while we take you to your destination.{' '}
            </div>
            <BackgroundSceneryForRocketLaunch />
            <Rocket className="absolute left-1/2 top-1/2 mr-0" />
        </div>
    );
};

// Ref: https://codepen.io/eva_trostlos/pen/aZQoLN
const Rocket = ({ className }: { className: string }) => {
    return (
        <div className={className}>
            <div className="rocket">
                <div className="rocket-body">
                    <div className="body"></div>
                    <div className="fin fin-left"></div>
                    <div className="fin fin-right"></div>
                    <div className="window"></div>
                </div>
                <div className="exhaust-flame"></div>
                <ul className="exhaust-fumes">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
};

export default RocketLaunch;
