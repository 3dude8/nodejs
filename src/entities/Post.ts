import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @ManyToMany(() => User)
    @JoinTable()
    likes: User[];

    @Column('simple-array', { nullable: true })
    tags: string[];

    @Column({ default: true })
    isPublished: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
