import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;
}
