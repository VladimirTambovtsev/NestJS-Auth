import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

// enum DocumentType {
//     BASIS_DOCUMNET = 'Базисные показатели',
//     NORMAL_DOCUMENT = 'Нормативные документы',
// }

@Entity('documents')
export class Documents {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    documentPath: string;

    // @Column({
    //     type: 'enum',
    //     enum: DocumentType,
    //     default: DocumentType.NORMAL_DOCUMENT,
    // })
    // type: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at: Date;
}
