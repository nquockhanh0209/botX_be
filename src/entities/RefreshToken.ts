import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { BaseEntity } from "src/base/base.entity";

@Entity("refresh_tokens")
export class RefreshToken extends BaseEntity {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column("text", { nullable: false })
  accessToken: string;

  @Column("bigint")
  expiredAt: number;

  @Column({ length: 255 })
  refreshString: string;

  @Column({ length: 255, nullable: true })
  userAgent: string | null;

  @Column({ length: 100, nullable: true })
  ip: string | null;
}
