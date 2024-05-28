import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(timestamp: number): string {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - timestamp;
    
    // Chuyển đổi thời gian từ milliseconds sang giây
    const seconds = Math.floor(timeDiff / 1000);
    
    if (seconds < 60) {
        return `${seconds} giây`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} phút`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} giờ `;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days} ngày`;
    }
  }
}
