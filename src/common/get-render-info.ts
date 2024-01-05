import { Interaction as SchedulerInteraction } from 'scheduler/tracing';

export const getRenderInfo = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<SchedulerInteraction>
) => {
    console.debug({
        id,
        phase,
        baseDuration,
        actualDuration,
        startTime,
        commitTime,
        interactions,
    });
};
