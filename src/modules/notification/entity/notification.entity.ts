import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql'
import { PartialType } from '@nestjs/swagger'

@ObjectType()
export class NotificationEntity {
  @Field(() => Number, { nullable: false })
  id!: number

  @Field(() => String, { nullable: true })
  message!: string

  @Field(() => String, { nullable: true })
  userName!: string

  @Field(() => String, { nullable: true })
  subscriptionId!: string

  @Field(() => Date, { nullable: true })
  createdAt!: Date

  @Field(() => Date, { nullable: true })
  updatedAt!: Date

  @Field(() => [String], { nullable: true })
  manifestList!: string[]
}
