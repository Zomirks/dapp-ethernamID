import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ nft_id: string }> }
) {
    try {
        const { nft_id } = await params
        const nftIdNumber = parseInt(nft_id, 10)

        if (isNaN(nftIdNumber) || nftIdNumber <= 0) {
            return NextResponse.json(
                { error: 'Invalid NFT ID' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                nft_id: nftIdNumber,
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { error: 'Error fetching user data' },
            { status: 500 }
        )
    }
}