import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    time: string;

    @Column()
    totalPrice: number;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;
}
