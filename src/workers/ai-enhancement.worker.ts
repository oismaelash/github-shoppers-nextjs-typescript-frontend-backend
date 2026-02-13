import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { DeepSeekAdapter } from '../adapters/deepseek.adapter';
import { ItemRepository } from '../repositories/item.repository';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const aiEnhancementWorker = new Worker(
  'AIEnhancementQueue',
  async (job: Job) => {
    console.log(`Processing job ${job.id} for item ${job.data.itemId}`);
    
    const { itemId, name, description } = job.data;
    
    try {
      const adapter = new DeepSeekAdapter();
      const repository = new ItemRepository();
      
      const enhanced = await adapter.enhanceContent(name, description);

      // Update item in database via Repository
      await repository.updateDetails(
        itemId,
        enhanced.improvedTitle,
        enhanced.improvedDescription
      );

      console.log(`Job ${job.id} completed. Item ${itemId} updated.`);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  },
  { connection: connection as any }
);
