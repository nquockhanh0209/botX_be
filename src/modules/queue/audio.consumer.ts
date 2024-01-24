// import { Job } from "bull";


// @Processor("audio")
// export class AudioConsumer {

//     @OnQueueActive()
//     onActive(job: Job): void {
//         console.log(
//             // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//             `Processing job ${job.id} of type ${job.name} with data ${job.data || {}}...`,
//         );
//     }

//     @Process()
//     async transcode(job: Job<unknown>): Promise<Job> {
//         console.log("Debug", job.data);

//         return job;
//     }
// }