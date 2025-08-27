import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.comments)
    author: User;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
    parentComment: Comment;

    @OneToMany(() => Comment, comment => comment.parentComment)
    replies: Comment[];

    @ManyToMany(() => User)
    @JoinTable()
    likes: User[];

    @Column({ default: false })
    isEdited: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
