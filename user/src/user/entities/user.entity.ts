import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({default: true})
    isEmailConfirmed: boolean;

    @Exclude()
    @Column()
    // hashed password
    password: string;

    @Column({nullable: true})
    hashed_refresh_token: string;

    @Column({default: 500})
    bonuses: number;

    @Column()
    fullname: string;

    @Column()
    phone: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;
}
