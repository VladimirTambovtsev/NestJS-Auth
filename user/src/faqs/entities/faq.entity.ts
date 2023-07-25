import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('faq')
export class FAQ {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    question: string;

    @Column({type: 'text'})
    answer: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;
}
