import { SetMetadata } from '@nestjs/common';

export const App = (...args: string[]) => SetMetadata('app', args);
