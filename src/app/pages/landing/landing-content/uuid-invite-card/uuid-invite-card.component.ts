import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uuid-invite-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uuid-invite-card.component.html',
  styleUrls: ['./uuid-invite-card.component.scss']
})
export class UuidInviteCardComponent {
  @Input() data: {
    name: string;
    program: string;
    message: string;
  } | null = null;
}
