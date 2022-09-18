import { Field, InputType, Int, PickType } from '@nestjs/graphql'

@InputType()
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

@InputType()
export class NotificationInputType extends PickType(NotificationEntity, [
  'manifestList',
  'subscriptionId',
  'userName',
]) {
  @Field()
  userName: string
}
