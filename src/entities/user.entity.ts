import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 20 })
  firstname: string

  @Column({ length: 20 })
  lastname: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @DeleteDateColumn()
  deleted_at: Date
}
