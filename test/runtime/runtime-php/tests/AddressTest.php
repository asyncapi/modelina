<?php

declare(strict_types=1);

namespace AsyncApi\Models;

use PHPUnit\Framework\TestCase;

final class AddressTest extends TestCase
{
    public function testItInstantiates(): void
    {
        $address = new Address();
        $this->assertInstanceOf(Address::class, $address);
    }
}
